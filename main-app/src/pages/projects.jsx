import Nav from "../components/_nav"
import Footer from "../components/_footer"
import { useState, useEffect } from "react"
import axios from 'axios'

function projects() {
    const [projectTitle, setProjectTitle] = useState();
    const [projectSummary, setProjectSummary] = useState();
    const [members, setMembers] = useState();
    const [createdBy, setCreatedBy] = useState();

    const handleProject = (e) => {
        const membersArray = members.split(',')
        console.log(membersArray)
        axios.post('http://localhost:3000/createProject', { projectTitle, projectSummary, membersArray, createdBy })
            .then((result) => {
                if (result.data.message == "successful") {
                    console.log("project success")
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <Nav></Nav>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createproject">Create Project</button>
            <div className="modal fade" id="createproject" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Create Project</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 row">
                                <div className="mb-3 row">
                                    <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="title" onChange={(e) => { setProjectTitle(e.target.value) }} />
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <label htmlFor="summary" className="col-sm-2 col-form-label">Summary</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="summary" onChange={(e) => { setProjectSummary(e.target.value) }} />
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <label htmlFor="members" className="col-sm-2 col-form-label">Members</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="members" placeholder="john123, alex24..." onChange={(e) => { setMembers(e.target.value) }} />
                                    </div>
                                </div>


                                <div className="mb-3 row">
                                    <label htmlFor="userid" className="col-sm-2 col-form-label">Created By (User Id)</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="userid" onChange={(e) => { setCreatedBy(e.target.value) }} />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleProject}>Create</button>
                        </div>
                    </div>
                </div>
            </div>
            <h1>Projects</h1>
            <LoadData />
            <Footer></Footer>
        </>
    )
}

// const LoadData = async () => {
//     var elements = "x";
//     await axios.get('http://localhost:3000/getProjects')
//         .then((result) => {
//             result.data.forEach(e => {
//                 elements += `<div className="card w-75 mb-3">
//                     <div className="card-body">
//                         <h5 className="card-title">${e.title}</h5>
//                         <p className="card-text">${e.summary}</p>
//                         <p className="card-text">Members: ${e.members}</p>
//                         <p className="card-text">Creator${e.createdby}</p>

//                         <a href="#" className="btn btn-primary">Button</a>
//                     </div>
//                 </div>`
//             });

//         })
//         .catch(err => console.log(err))

//     console.log(elements)
//     return elements
// }

const LoadData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:3000/getProjects');
                setData(result.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Simple loading indicator
    }

    if (error) {
        return <div>Error: {error.message}</div>; // Simple error message
    }

    return (
        <div className="container">
            {data.map((item, index) => (
                <div key={index} className="card w-75 mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{item.title}</h5>
                        <p className="card-text">{item.summary}</p>
                        <p className="card-text">Members: {item.members}</p>
                        <p className="card-text">Creator: {item.createdby}</p>
                        <a href="#" className="btn btn-primary">
                            Show More
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default projects