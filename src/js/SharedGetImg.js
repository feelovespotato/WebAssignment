function getImageSrc(image) {
    return typeof image === "string" ? image : image.src;
}