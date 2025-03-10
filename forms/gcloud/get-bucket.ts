import {Bucket, Storage} from "@google-cloud/storage";

export const getBucket = (): Bucket => {
    if (Deno.env.get('GCP_CREDENTIALS')) {
        const authJson = Deno.env.get('GCP_CREDENTIALS') || "{}";
        const jsonAuth = JSON.parse(authJson);
        const gc = new Storage({
            credentials: jsonAuth,
            projectId: jsonAuth.project_id,
        });
        return gc.bucket('punjabi-forms');
    }
    const authJson = Deno.env.get('gcloud_storage_auth_file');
    const projectId = Deno.env.get('gcloud_project_id');
    const gc = new Storage({
        keyFilename: authJson,
        projectId,
    });
    return gc.bucket('punjabi-forms');
}