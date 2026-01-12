import React, { useCallback, useRef } from 'react'
import gsap from 'gsap'
import { useEffect } from 'react'
import { useGSAP } from '@gsap/react';
type Props={
    textContent:string[]
}
function AnimatedSpanText({props}:{props:Props}) {
    const [text,setText]=React.useState<string>(props.textContent[0] || "");
   const indexRef = React.useRef(0);
    const containerRef=useRef<HTMLSpanElement>(null);
useGSAP(()=>{
    const chars = containerRef.current?.children;
    if (!chars) return;

    gsap.set(chars, { opacity: 0 });

    const tl = gsap.timeline({
        onComplete: () => {
        indexRef.current =(indexRef.current + 1) % props.textContent.length;
        setText(props.textContent[indexRef.current]);
      },
    });
     tl.to(chars, {
      opacity: 1,
      stagger: 0.1,
      duration: 0.5,
      ease: "linear",
    });
 tl.to({}, { duration: 1 });

    tl.to(chars,{
        opacity:0,
        stagger:{
            each:0.1,
            from: "end",
        },
         duration: 0.5,
      ease: "linear",
    })

    tl.to({}, { duration: 0.5 });

     return () => tl.kill();
},[text])
  return (
    <span
      ref={containerRef}
      style={{ display: "inline-block", whiteSpace: "pre" }}
    >
      {text.split("").map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </span>
  )
}

export default AnimatedSpanText