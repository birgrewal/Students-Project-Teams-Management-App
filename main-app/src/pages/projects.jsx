import Nav from "../components/_nav"
import Footer from "../components/_footer"

function projects() {
    return (
        <>
            <Nav></Nav>
            <h1>Projects</h1>
            <div class="card w-75 mb-3">
                <div class="card-body">
                    <h5 class="card-title">Project 1</h5>
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" class="btn btn-primary">Button</a>
                </div>
            </div><div class="card w-75 mb-3">
                <div class="card-body">
                    <h5 class="card-title">Project 2</h5>
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" class="btn btn-primary">Button</a>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}

export default projects