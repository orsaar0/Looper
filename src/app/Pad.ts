export interface Pad {
    source: string;
    name: string;
    audio?:HTMLAudioElement;
    btn?: {label:string, disabled:boolean};
    imgSrc?: string;
}