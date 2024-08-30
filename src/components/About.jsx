// import { useEffect } from "react";

function About(props)
{
    // useEffect(()=>{props.theThing()}, [props])
    return (
        <>
        <div className="container">
            <h1 className=" center">About Me</h1>
        </div>
            <div className="container">
                <div className="introduction">
                Hi, I'm Thomas- a veteran and passionate web developer with three years of experience in creating dynamic web applications and building robust websites. As a full stack web developer, I specialize in using HTML, CSS, and JavaScript to craft engaging front-end experiences, and C# and SQL to develop powerful APIs and database solutions. <br/><br/>
                            Throughout my career, I've had the pleasure of working with various clients and companies. I designed a captivating landing page for Makai Watersports Rentals and maintained client management software for IMT Insurance's Software Services department. Additionally, I've created tailored websites for small business owners, helping them establish a strong online presence.<br/><br/>
                            In my free time, I dive into the world of game development with Godot. Currently, I'm working on an exciting project called King's Ascension. <br/><br/>
                            Explore my portfolio to see my work and discover how I can bring your web development ideas to life!
                </div>
            </div>
        </>
    )
}

export default About;