declare module '*.html' {
  const value: string;
  export default value;
}

declare interface CarouselEvent extends Event {
  to: number;
  from: number;
}
