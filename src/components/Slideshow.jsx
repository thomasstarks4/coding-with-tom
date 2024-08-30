import {useState} from "react"
import imgSrcNav from "../media/chris-ried-ieic5Tq8YMk-unsplash.jpg";
import imgSrc1 from "../media/chris-ried-ieic5Tq8YMk-unsplash.jpg";
import imgSrc2 from "../media/kevin-ku-w7ZyuGYNpRQ-unsplash.jpg";
import imgSrc3 from "../media/roman-synkevych-vXInUOv1n84-unsplash.jpg";

function Slideshow()
{

    const [slide, setSlide] = useState(1);
    const imgSrcs = [imgSrcNav, imgSrc1, imgSrc2, imgSrc3];
    const [imgSrc, setImgSrc] = useState(imgSrcs[slide]);

    setInterval(setSlide(slide + 1), 5000);
    setImgSrc(imgSrcs(slide));


    return (
        <img className="main-image" src={imgSrc} alt="test"/>

        
    );
}

export default Slideshow;