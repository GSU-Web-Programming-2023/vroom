uniform sampler2D tBackground;
    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(tBackground, vUv);
    }