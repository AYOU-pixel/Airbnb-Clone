// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // استخراج معاملات البحث
    const destination = searchParams.get('destination')?.trim() || '';
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = parseInt(searchParams.get('guests') || '0');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0');
    const bathrooms = parseFloat(searchParams.get('bathrooms') || '0');
    const amenities = searchParams.get('amenities')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'relevance'; // relevance, price_low, price_high, rating
    
    console.log('🔍 Search params:', {
      destination,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      sortBy
    });

    // بناء شروط البحث
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchConditions: any = {
      AND: []
    };

    // البحث في الوجهة (العنوان والموقع)
    if (destination) {
      searchConditions.AND.push({
        OR: [
          {
            title: {
              contains: destination,
              mode: 'insensitive'
            }
          },
          {
            location: {
              contains: destination,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: destination,
              mode: 'insensitive'
            }
          }
        ]
      });
    }

    // فلترة عدد الضيوف
    if (guests > 0) {
      searchConditions.AND.push({
        maxGuests: {
          gte: guests
        }
      });
    }

    // فلترة السعر
    if (minPrice > 0 || maxPrice < 999999) {
      searchConditions.AND.push({
        price: {
          gte: minPrice,
          lte: maxPrice
        }
      });
    }

    // فلترة غرف النوم
    if (bedrooms > 0) {
      searchConditions.AND.push({
        bedrooms: {
          gte: bedrooms
        }
      });
    }

    // فلترة الحمامات
    if (bathrooms > 0) {
      searchConditions.AND.push({
        bathrooms: {
          gte: bathrooms
        }
      });
    }

    // فلترة الخدمات
    if (amenities.length > 0) {
      searchConditions.AND.push({
        amenities: {
          hasEvery: amenities
        }
      });
    }

    // التحقق من التواريخ والحجوزات المتضاربة
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // التأكد من صحة التواريخ
      if (checkInDate >= checkOutDate) {
        return NextResponse.json(
          { error: 'Check-out date must be after check-in date' },
          { status: 400 }
        );
      }

      // استبعاد العقارات المحجوزة في هذه الفترة
      searchConditions.AND.push({
        NOT: {
          reservations: {
            some: {
              AND: [
                {
                  paymentStatus: 'succeeded'
                },
                {
                  OR: [
                    {
                      AND: [
                        { startDate: { lte: checkInDate } },
                        { endDate: { gt: checkInDate } }
                      ]
                    },
                    {
                      AND: [
                        { startDate: { lt: checkOutDate } },
                        { endDate: { gte: checkOutDate } }
                      ]
                    },
                    {
                      AND: [
                        { startDate: { gte: checkInDate } },
                        { endDate: { lte: checkOutDate } }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      });
    }

    // إعداد ترتيب النتائج
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' }; // الترتيب الافتراضي

    switch (sortBy) {
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'reviews':
        orderBy = { reviews: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        // للترتيب حسب الصلة، نرتب حسب التطابق مع الوجهة أولاً
        if (destination) {
          orderBy = [
            { guestFavorite: 'desc' },
            { rating: 'desc' },
            { reviews: 'desc' }
          ];
        }
    }

    console.log('🔍 Search conditions:', JSON.stringify(searchConditions, null, 2));

    // تنفيذ البحث
    const listings = await prisma.listing.findMany({
      where: searchConditions.AND.length > 0 ? searchConditions : {},
      include: {
        reservations: {
          where: {
            paymentStatus: 'succeeded'
          },
          select: {
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy
    });

    console.log(`🔍 Found ${listings.length} listings`);

    // معالجة النتائج
    const processedListings = listings.map(listing => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reservations, ...listingData } = listing;
      
      return {
        ...listingData,
        id: listing.id,
        title: listing.title,
        location: listing.location,
        images: listing.images || [],
        price: listing.price,
        rating: listing.rating || 4.5,
        distance: listing.distance || '',
        dateRange: listing.dateRange || '',
        isNew: listing.isNew || false,
        guestFavorite: listing.guestFavorite || false,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        description: listing.description,
        amenities: listing.amenities || [],
        reviews: listing.reviews || 0,
        host: listing.host,
        maxGuests: listing.maxGuests,
        createdAt: listing.createdAt.toISOString(),
        // إضافة معلومات إضافية للبحث
        availabilityInfo: {
          isAvailable: checkIn && checkOut ? true : null,
          searchedDates: checkIn && checkOut ? { checkIn, checkOut } : null
        }
      };
    });

    // إحصائيات البحث
    const searchStats = {
      total: processedListings.length,
      filters: {
        destination: destination || null,
        dateRange: checkIn && checkOut ? { checkIn, checkOut } : null,
        guests: guests || null,
        priceRange: minPrice > 0 || maxPrice < 999999 ? { min: minPrice, max: maxPrice } : null,
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        amenities: amenities.length > 0 ? amenities : null
      },
      sortBy
    };

    return NextResponse.json({
      listings: processedListings,
      stats: searchStats,
      success: true
    });

  } catch (error) {
    console.error('❌ Search API Error:', error);
    
    return NextResponse.json(
      {
        error: 'Search failed',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : 'Something went wrong',
        listings: [],
        stats: null
      },
      { status: 500 }
    );
  }
}