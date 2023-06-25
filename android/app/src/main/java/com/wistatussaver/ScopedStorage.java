package com.wistatussaver;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.storage.StorageManager;
import android.provider.DocumentsContract;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.io.File;
import java.util.List;

import android.util.Log;

public class ScopedStorage extends ReactContextBaseJavaModule {

    private static final int REQUEST_CODE_OPEN_DIRECTORY = 1;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_FAILED_TO_OPEN_FOLDER = "E_FAILED_TO_OPEN_FOLDER";

    private Promise folderPromise;
    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == REQUEST_CODE_OPEN_DIRECTORY) {
                if (folderPromise != null) {
                    if (resultCode == Activity.RESULT_OK && data != null && data.getData() != null) {
                        Uri directoryUri = data.getData();
                        folderPromise.resolve(directoryUri.toString());
                    } else {
                        folderPromise.reject(E_FAILED_TO_OPEN_FOLDER, "Failed to open folder");
                    }
                    folderPromise = null;
                }
            }
        }
    };

    public ScopedStorage(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @NonNull
    @Override
    public String getName() {
        return "ScopedStorage";
    }

    @ReactMethod
    public void requestAccessToStatusesFolder(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        folderPromise = promise;

        StorageManager storageManager = (StorageManager) currentActivity.getSystemService(currentActivity.STORAGE_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                Log.d("URI", "inside if()");
                Intent intent = storageManager.getPrimaryStorageVolume().createOpenDocumentTreeIntent();
                String startDir = "Android%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses";

                Uri uri = intent.getParcelableExtra("android.provider.extra.INITIAL_URI");

                String scheme = uri.toString();
                scheme = scheme.replace("/root/", "/document/");
                scheme += "%3A" + startDir;

                uri = Uri.parse(scheme);

                Log.d("URI", uri.toString());

                intent.putExtra("android.provider.extra.INITIAL_URI", uri);
//                intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, Uri.fromFile(new File(startDir)));

                currentActivity.startActivityForResult(intent, REQUEST_CODE_OPEN_DIRECTORY);
            }
        }
    }
}
