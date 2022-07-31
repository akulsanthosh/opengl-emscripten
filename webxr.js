const runXR = (frame) => {
    const pose = frame.getViewerPose(refSpace);
    if (!pose) {return;}
    for (const view of pose.views) {
        if (view.camera) {
            const cameraTexture = glBinding.getCameraImage(view.camera);
            // console.log(cameraTexture);
        }
    }

}


const requestSession = async () => {
    // Session type and features
    const sessionType = 'immersive-ar'
    const sessionInit = {
        requiredFeatures: ['local', 'camera-access']
    }

    // Request Session and update baselayer
    const session = await navigator.xr.requestSession(sessionType, sessionInit)
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, ctx)
    })

    refSpace = await session.requestReferenceSpace(sessionInit.requiredFeatures[0]);
    // XRWebGLBinding interface is used to create layers that have a GPU backend
    glBinding = new XRWebGLBinding(session, ctx)
    const renderLoop = (time, frame) => {
        session.requestAnimationFrame(renderLoop)

        runXR(frame)
    }

    session.requestAnimationFrame(renderLoop)
}

const startWebXRSession = () => {
    // Check if WebXR supported
    if (navigator.xr){
        // Check if AR supported
        navigator.xr.isSessionSupported('immersive-ar')
        .then((supported) => supported? requestSession(): console.log("AR not supported"))
    }
    else console.log("WebXR not supported")
}

const canvas = new OffscreenCanvas(1,1)
const ctx = canvas.getContext('webgl', {xrCompatible: true})
let glBinding = null
let refSpace = null
const button = document.getElementById('ar')
button.onclick = () => startWebXRSession()