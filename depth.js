// Utililty function to trigger camera texture creation event and access texture data
const eventDispatch = (name, data) => {
    const e = new CustomEvent(name, {detail: data})
    window.dispatchEvent(e)
}

const runXR = (frame) => {
    // Pose provides extrinsic, linear velocity, angular velocity and views
    const pose = frame.getViewerPose(refSpace);
    if (!pose) {return;} // Not guaranteed that pose be available for every XRFrame

    // Query different views in pose, for AR view.camera contains the camera texture
    for (const view of pose.views) {
        const depthInfo = frame.getDepthInformation(view);
        if(depthInfo) {
            const depthInMeters = depthInfo.getDepthInMeters(0, 0);
            console.log(depthInMeters)
        }
    }
}

const requestSession = async () => {
    // Session type and features
    const sessionType = 'immersive-ar'
    const sessionInit = {
        requiredFeatures: ['local', 'depth-sensing'],
        depthSensing: {
            usagePreference: ["cpu-optimized"],
            dataFormatPreference: ["luminance-alpha"]
        }
    }

    // Request Session and update baselayer
    session = await navigator.xr.requestSession(sessionType, sessionInit)
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, ctx)
    })

    console.log(session.depthUsage);
    console.log(session.depthFormat);

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

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('webgl', {xrCompatible: true})
let glBinding = null
let refSpace = null
let session = null
const button = document.getElementById('ar')
button.onclick = () => startWebXRSession()