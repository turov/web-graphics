import React from "react";

type Viewport = {
    width: number;
    size: string;
    value: "s" | "m" | "l";
};

type PictureProps = {
    name: string;
    alt: string;
    responsive?: boolean;
    lazy?: boolean;
    className?: string;
    fallbackToPng?: boolean;
    viewports?: Viewport[];
    retina?: boolean;
};

const defaultViewports: Viewport[] = [
    { width: 480, size: "(max-width: 600px)", value: "s" },
    { width: 800, size: "(max-width: 1200px)", value: "m" },
    { width: 1200, size: "1200px", value: "l" },
];

const defaultProps: Partial<PictureProps> = {
    responsive: false,
    lazy: true,
    fallbackToPng: false,
    viewports: defaultViewports,
    retina: true,
};

const Picture: React.FC<PictureProps> = (props) => {
    const { name, alt, responsive, lazy, className, fallbackToPng, viewports, retina } = {
        ...defaultProps,
        ...props,
    };

    const basePath = `/images/${name}`;
    const fallbackFormat = fallbackToPng ? "png" : "jpg";

    const generateSrcSet = (format: string): string => {
        if (!responsive) {
            // Используем значение первого вьюпорта как дефолтное
            const defaultValue = viewports![0].value;
            return `${basePath}@1x-${defaultValue}.${format}`;
        }

        return viewports!
            .map((vp) => {
                const src1x = `${basePath}@1x-${vp.value}.${format} ${vp.width}w`;
                const src2x = retina ? `, ${basePath}@2x-${vp.value}.${format} ${vp.width * 2}w` : "";
                return `${src1x}${src2x}`;
            })
            .join(", ");
    };

    const generateSizes = (): string | undefined =>
        responsive ? viewports!.map((vp) => vp.size).join(", ") : undefined;

    return (
        <picture>
            <source srcSet={generateSrcSet("avif")} type="image/avif" sizes={generateSizes()} />
            <source srcSet={generateSrcSet("webp")} type="image/webp" sizes={generateSizes()} />
            <img
                src={`${basePath}@1x-${viewports![0].value}.${fallbackFormat}`}
                srcSet={generateSrcSet(fallbackFormat)}
                sizes={generateSizes()}
                alt={alt}
                className={className}
                loading={lazy ? "lazy" : "eager"}
            />
        </picture>
    );
};

export default Picture;


<Picture
    name="example"
    alt="image-description"
    fallbackToPng={true}
/>