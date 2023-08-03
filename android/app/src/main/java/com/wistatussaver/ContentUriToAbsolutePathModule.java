package com.wistatussaver;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.OpenableColumns;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ContentUriToAbsolutePathModule extends ReactContextBaseJavaModule {

    public ContentUriToAbsolutePathModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ContentUriToAbsolutePathModule";
    }

    @ReactMethod
    public void resolveUriPath(String uriString, Promise promise) {
        Uri contentUri = Uri.parse(uriString);
        Context context = getReactApplicationContext();
        ContentResolver contentResolver = context.getContentResolver();
        String[] projection = {MediaStore.MediaColumns.DATA};

        // Check if the device is running Android Q (10) or later
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && isSafUri(contentUri)) {
            try {
                InputStream inputStream = contentResolver.openInputStream(contentUri);
                if (inputStream != null) {
                    File outputFile = createTempFile(context, contentUri);
                    if (outputFile != null) {
                        OutputStream outputStream = new FileOutputStream(outputFile);
                        byte[] buffer = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) > 0) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                        inputStream.close();
                        outputStream.close();
                        promise.resolve(Uri.fromFile(outputFile).toString());
                    } else {
                        promise.reject("CONVERSION_ERROR", "Failed to create a temporary file.");
                    }
                } else {
                    promise.reject("CONVERSION_ERROR", "Failed to open the input stream.");
                }
            } catch (IOException e) {
                promise.reject("CONVERSION_ERROR", e.getMessage());
            }
        } else {
            // Fallback for pre-Android Q devices or non-SAF URIs
            Cursor cursor = null;
            try {
                cursor = contentResolver.query(contentUri, projection, null, null, null);
                if (cursor != null && cursor.moveToFirst()) {
                    int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA);
                    String filePath = cursor.getString(columnIndex);
                    String fileUriString = "file://" + filePath;
                    promise.resolve(fileUriString);
                } else {
                    promise.reject("CONVERSION_ERROR", "Failed to convert the Content URI to a File URI.");
                }
            } catch (Exception e) {
                promise.reject("CONVERSION_ERROR", e.getMessage());
            } finally {
                if (cursor != null) {
                    cursor.close();
                }
            }
        }

    }
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private boolean isSafUri(Uri uri) {
        return DocumentsContract.isDocumentUri(getReactApplicationContext(), uri);
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private File createTempFile(Context context, Uri uri) throws IOException {
        String displayName = getDisplayNameFromUri(context, uri);
        File outputDir = context.getCacheDir();
        return File.createTempFile("temp_", displayName, outputDir);
    }

    @RequiresApi(api = Build.VERSION_CODES.Q)
    private String getDisplayNameFromUri(Context context, Uri uri) {
        try (Cursor cursor = context.getContentResolver().query(uri, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                @SuppressLint("Range") String displayName = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                cursor.close();
                return displayName;
            }
        }
        return null;
    }

}
