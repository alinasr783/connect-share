import { PAGE_SIZE } from "../constant/const";
import supabase from "./supabase";

export async function getProviderClinics(userId) {
    const { data: clinics, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('userId', userId)

    if (error) {
        throw error
    }

    return clinics
}

// Upload images to Supabase storage
export async function uploadClinicImages(images, clinicId) {
    const uploadedImages = [];

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `${clinicId}-${Date.now()}-${i}-${image.file.name}`;

        const { error } = await supabase.storage
            .from('clinics-images')
            .upload(fileName, image.file);

        if (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${image.name}`);
        }

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
            .from('clinics-images')
            .getPublicUrl(fileName);

        uploadedImages.push(publicUrl);
    }

    return uploadedImages;
}

export async function CreateUpdateClinic(clinicData, id) {
    // Separate images from clinic data
    const { images, existingImages = [], ...clinicDataWithoutImages } = clinicData;

    let query = supabase.from('clinics');
    let result;

    if (!id) {
        // Creating new clinic
        query = query.insert([clinicDataWithoutImages]);
        const { data, error } = await query.select().single();

        if (error) {
            throw new Error('Error creating clinic');
        }

        result = data;

        // Upload new images and combine with existing ones
        let allImages = [...existingImages];

        if (images && images.length > 0) {
            try {
                const uploadedImageUrls = await uploadClinicImages(images, result.id);
                allImages = [...allImages, ...uploadedImageUrls];
            } catch (imageError) {
                // If image upload fails, delete the created clinic
                await supabase.from('clinics').delete().eq('id', result.id);
                throw imageError;
            }
        }

        // Update clinic with all image URLs (existing + new)
        if (allImages.length > 0) {
            const { data: updatedData, error: updateError } = await supabase
                .from('clinics')
                .update({ images: allImages })
                .eq('id', result.id)
                .select()
                .single();

            if (updateError) {
                throw new Error('Error updating clinic with images');
            }

            result = updatedData;
        }
    } else {
        // Updating existing clinic
        let allImages = [...existingImages];

        if (images && images.length > 0) {
            const uploadedImageUrls = await uploadClinicImages(images, id);
            allImages = [...allImages, ...uploadedImageUrls];
        }

        // Include all images in the update
        if (allImages.length > 0) {
            clinicDataWithoutImages.images = allImages;
        }

        query = query.update(clinicDataWithoutImages).eq('id', id);
        const { data, error } = await query.select().single();

        if (error) {
            throw new Error('Error updating clinic');
        }

        result = data;
    }

    return result;
}

// Find clinics
export async function getFindClinics({ 
    page, 
    filters = [], 
    searchQuery = '',
    specialty = '',
    district = '',
    priceRange = null
}) {
    let query = supabase
        .from('clinics')
        .select(`
            id,
            name,
            address,
            images,
            pricing,
            pricingModel,
            specialty,
            district,
            features,
            availableDate,
            availableHours,
            status,
            userId,
            created_at
        `, { count: 'exact' })
        .eq('status', 'active');

    // Search by name or address
    if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`);
    }

    // Filter by specialty
    if (specialty) {
        query = query.eq('specialty', specialty);
    }

    // Filter by district
    if (district) {
        query = query.eq('district', district);
    }

    // Filter by price range
    if (priceRange) {
        const { min, max } = priceRange;
        if (min) {
            query = query.gte('pricing->hourlyRate', min);
        }
        if (max) {
            query = query.lte('pricing->hourlyRate', max);
        }
    }

    // Additional custom filters
    filters.forEach(filter => {
        if (filter && filter.field && filter.value) {
            switch (filter.operator) {
                case 'eq':
                    query = query.eq(filter.field, filter.value);
                    break;
                case 'gt':
                    query = query.gt(filter.field, filter.value);
                    break;
                case 'lt':
                    query = query.lt(filter.field, filter.value);
                    break;
                case 'contains':
                    query = query.ilike(filter.field, `%${filter.value}%`);
                    break;
                default:
                    query = query.eq(filter.field, filter.value);
            }
        }
    });

    // Pagination
    if (page) {
        const from = (page - 1) * PAGE_SIZE;
        const to = page * PAGE_SIZE - 1;
        query = query.range(from, to);
    }

    // Sort by creation date, newest first
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
        console.error('Error finding clinics:', error);
        throw new Error('Error finding clinics: ' + error.message);
    }

    // Transform the data to include availability status
    const transformedData = data?.map(clinic => {
        const hasAvailability = clinic.availableDate && (
            (Array.isArray(clinic.availableDate.days) && clinic.availableDate.days.length > 0) ||
            (clinic.availableDate.from && clinic.availableDate.to)
        );

        return {
            ...clinic,
            isAvailable: hasAvailability,
            hasTimeSlots: Boolean(clinic.availableHours),
            featuresCount: clinic.features?.length || 0,
            basePrice: clinic.pricing?.hourlyRate || clinic.pricing?.dailyRate || 0
        };
    }) || [];

    return { 
        data: transformedData, 
        count,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(count / PAGE_SIZE),
        currentPage: page || 1
    }
}

export async function getFindClinicsById(id) {
    const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error finding clinic:', error);
        throw new Error('Error finding clinic');
    }

    return data;
}

export async function getCheckIfBooked(userId, clinicId) {
    const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('docId', userId)
        .eq('clinicId', clinicId)
        .eq('status', 'unconfirmed')

    if (error) {
        console.error('Error getting check if booked:', error);
        throw new Error('Error getting check if booked');
    }

    return data;
}

export async function getClinicById(id) {
    const { data, error } = await supabase
        .from('clinics')
        .select(`
            *,
            provider:userId(
                userId,
                fullName,
                email
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error getting clinic:', error);
        throw new Error('Error getting clinic');
    }

    if (data && data.provider) {
        return {
            ...data,
            providerName: data.provider.fullName,
            providerEmail: data.provider.email,
            providerId: data.provider.userId
        };
    }

    return data;
}

export async function getAdminClinics({ page = 1, pageSize = PAGE_SIZE, status = "", date = "" } = {}) {
    const query = supabase
        .from('clinics')
        .select(`
            *,
            provider:userId(
                userId,
                fullName,
                email
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

    if (status) {
        query.eq('status', status);
    }

    if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        query.gte('created_at', startDate.toISOString())
            .lt('created_at', endDate.toISOString());
    }

    if (page) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error getting admin clinics:', error);
        throw new Error('Error getting admin clinics');
    }

    const transformedData = data?.map(clinic => {
        if (clinic.provider) {
            return {
                ...clinic,
                providerName: clinic.provider.fullName,
                providerEmail: clinic.provider.email,
                providerId: clinic.provider.userId
            };
        }
        return clinic;
    }) || [];

    return { data: transformedData, count: count ?? 0 };
}

export async function deleteClinic(id) {
    const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting clinic:', error);
        throw new Error('Error deleting clinic');
    }

    return true;
}

export async function getClinicBookings(clinicId) {
    const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('clinicId', clinicId);

    if (error) {
        console.error('Error getting clinic bookings:', error);
        throw new Error('Error getting clinic bookings');
    }

    return data;
}
export async function getClinicDetails(id) {
    const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error getting clinic details:', error);
        throw new Error('Error getting clinic details');
    }

    return data;
}

export async function updateClinic(id, clinicData) {
    const { data, error } = await supabase
        .from('clinics')
        .update(clinicData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating clinic:', error);
        throw new Error('Error updating clinic');
    }

    return data;
}

export async function updateClinicStatus(id, status) {
    const { data, error } = await supabase
        .from('clinics')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating clinic status:', error);
        throw new Error('Error updating clinic status');
    }

    return data;
}


export async function getClinicStats(clinicId) {

    const id = typeof clinicId === 'object' ? clinicId.id : clinicId;
    if (!id) {
        console.error('clinicId is required for getClinicStats');
        return {
            totalBookings: 0,
            confirmedBookings: 0,
            unconfirmedBookings: 0
        };
    }

    const { data: bookings, error: bookingsError } = await supabase
        .from('rentals')
        .select('id, status')
        .eq('clinicId', id);

    if (bookingsError) {
        console.error('Error getting clinic bookings stats:', bookingsError);
        throw new Error('Error getting clinic bookings stats');
    }

    const totalBookings = bookings?.length || 0;
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    const unconfirmedBookings = bookings?.filter(b => b.status === 'unconfirmed').length || 0;

    return {
        totalBookings,
        confirmedBookings,
        unconfirmedBookings
    };
}

export async function getClinics({ page = 1, pageSize = PAGE_SIZE, filters = [] } = {}) {
    const query = supabase
        .from('clinics')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    // pagination
    if (page) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query.range(from, to);
    }

    // filters
    filters.forEach(filter => {
        if (filter && filter.field && filter.value) {
            query.eq(filter.field, filter.value);
        }
    });

    const { data, error, count } = await query;

    if (error) {
        console.error('Error getting clinics:', error);
        throw new Error('Error getting clinics');
    }

    return { data, count };
}
