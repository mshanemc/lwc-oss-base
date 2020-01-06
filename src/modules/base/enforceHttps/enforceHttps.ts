const enforceHttps = () => {
    if (
        window.location.hostname !== 'localhost' &&
        window.location.protocol === 'http:'
    ) {
        window.location.href = window.location.href.replace('http', 'https');
    }
};

export { enforceHttps };
