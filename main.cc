#include <stdio.h>
// #include <GLES2/gl2.h>
// #include <GLES2/gl2ext.h>
#include <emscripten.h>

extern "C" {
    
    EMSCRIPTEN_KEEPALIVE
    GLuint testFunction(){
        EM_ASM({
            console.log('it works')
        });

        // GLuint id;
        // glGenTextures(1, &id);
        // return id;
    }
}