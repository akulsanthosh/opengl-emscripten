// Utililty function to trigger camera texture creation event and access texture data
const eventDispatch = (name, data) => {
    const e = new CustomEvent(name, {detail: data})
    window.dispatchEvent(e)
}

var saveByteArray = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, name) {
        var blob = new Blob(data),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

let count = 0

const runXR = (frame) => {
    // Pose provides extrinsic, linear velocity, angular velocity and views
    const pose = frame.getViewerPose(refSpace);
    if (!pose) {return;} // Not guaranteed that pose be available for every XRFrame

    // Query different views in pose
    for (const view of pose.views) {
        // Get Depth information from view
        const depthInfo = frame.getDepthInformation(view);
        if(depthInfo) {
            count += 1
            // The depth of pixel coordinate at x,y.
            // const depthInMeters = depthInfo.getDepthInMeters(0.5, 0.5);
            console.log(depthInfo.width, depthInfo.height)
            const uint16 = new Uint16Array(depthInfo.data);
            // console.log(uint16)

            if (count === 200) {
                saveByteArray([uint16], 'd.txt');
                console.log(depthInfo.rawValueToMeters)
            // const index = depthInfo.width/2 + depthInfo.height/2 * depthInfo.width;
            // const depthPre = uint16[index] * depthInfo.rawValueToMeters;
            // console.log(depthPre)
                
            //     const depthPre = depthInfo.getDepthInMeters(10, 10);
            //     console.log(depthPre)
            }
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