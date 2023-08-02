package com.wistatussaver;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class ContentUriToAbsolutePathModule extends ReactContextBaseJavaModule {

    public ContentUriToAbsolutePathModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ContentUriToAbsolutePathModule";
    }

    @ReactMethod
    public void getAbsolutePathFromContentUri(String contentUriString, Promise promise) {
        try {
            Uri contentUri = Uri.parse(contentUriString);
            ContentResolver contentResolver = getReactApplicationContext().getContentResolver();

            String[] projection = {MediaStore.MediaColumns.DATA};
            Cursor cursor = contentResolver.query(contentUri, projection, null, null, null);

            if (cursor != null && cursor.moveToFirst()) {
                int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA);
                String absolutePath = cursor.getString(columnIndex);
                cursor.close();
                promise.resolve(absolutePath);
            } else {
                promise.reject("FILE_NOT_FOUND", "Unable to find file from Content URI.");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
