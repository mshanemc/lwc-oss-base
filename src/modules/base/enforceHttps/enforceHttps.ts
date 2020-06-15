const enforceHttps = () => {
    if (
        window.location.protocol === 'http:' &&
        window.location.hostname !== 'localhost' &&
        !window.location.host.startsWith('192.168.')
    ) {
        window.location.href = window.location.href.replace('http', 'https');
    }
};

export { enforceHttps };
