
function HamburgerButton(props)
{

    function theThing()
    {
        const containers = document.querySelectorAll(".container");

        containers.forEach(container => {
            if (props.showMenu === true)
            {
                container.classList.toggle("reduced", false);
            }
            else {
                container.classList.toggle("reduced", true);
            }
        });
        props.onClick();
    }
    return(
            <nav >
                <div onClick={theThing} className="ham-menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
    )
}

export default HamburgerButton;