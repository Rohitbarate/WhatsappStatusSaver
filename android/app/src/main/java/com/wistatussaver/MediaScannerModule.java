package com.wistatussaver;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.io.File;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.media.MediaScannerConnection.MediaScannerConnectionClient;
import android.net.Uri;


public class MediaScannerModule extends ReactContextBaseJavaModule {

    public MediaScannerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private static class SingleMediaScanner implements MediaScannerConnectionClient {
        private MediaScannerConnection mMs;
        private File mFile;

        public SingleMediaScanner(Context context, File f) {
            mFile = f;
            mMs = new MediaScannerConnection(context, this);
            mMs.connect();
        }

        @Override
        public void onMediaScannerConnected() {
            mMs.scanFile(mFile.getAbsolutePath(), null);
        }

        @Override
        public void onScanCompleted(String path, Uri uri) {
            mMs.disconnect();
        }
    }

    @Override
    public String getName() {
        return "MediaScannerModule";
    }

    @ReactMethod
    public void scanFile(String filePath) {
        File file = new File(filePath);
        SingleMediaScanner mediaScanner = new SingleMediaScanner(getReactApplicationContext(), file);
    }


}
