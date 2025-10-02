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
export async function getFindClinics({ page }) {
    const query = supabase
        .from('clinics')
        .select('id, name, address, images, pricing',
            { count: 'exact' })
        .order('created_at', { ascending: false });

    if (page) {
        const from = (page - 1) * PAGE_SIZE;
        const to = page * PAGE_SIZE - 1;
        query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error finding clinics:', error);
        throw new Error('Error finding clinics');
    }

    return { data, count }
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