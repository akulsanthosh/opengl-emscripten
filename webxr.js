const runXR = () => {
    
}


const requestSession = async () => {
    // Session type and features
    const sessionType = 'immersive-ar'
    const sessionInit = {
        requiredFeatures: ['local']
    }

    // Request Session and update baselayer
    const session = await navigator.xr.requestSession(sessionType, sessionInit)
    session.updateRenderState({
        baseLayer: new XRWebGLLayer(session, ctx)
    })

    // XRWebGLBinding interface is used to create layers that have a GPU backend
    glBinding = new XRWebGLBinding(session, ctx)

    const renderLoop = (time, frame) => {
        session.requestAnimationFrame(renderLoop)

        runXR()
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
const glBinding = null

const button = document.getElementById('ar')
button.onclick = () => startWebXRSession()