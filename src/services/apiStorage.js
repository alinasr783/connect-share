import supabase from "./supabase";

export async function uploadSyndicateCard(file, userId) {
    try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `syndicate-card-${userId}-${Date.now()}.${fileExt}`;

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from('syndicate-card')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw new Error('Error uploading syndicate card: ' + error.message);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('syndicate-card')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'An error occurred while uploading the file');
    }
}

export async function uploadAvatar(file, userId) {
    try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw new Error('Error uploading avatar: ' + error.message);

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'An error occurred while uploading the file');
    }
}
