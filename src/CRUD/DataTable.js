
import { useState, useEffect} from "react";

const DataTable =()=>{

    const [formdata, setFormData] = useState({id:"",name:"",gender:"",age:""})

    const getLocalStorgeData =()=>{
        let localData = localStorage.getItem("CRUD");
        if(localData){
            return JSON.parse(localData);
        }else{
            return [];
        }
    }

    const [Data, setData] = useState(getLocalStorgeData);
    const [editId, setEditId] =useState(false);
    const [searchData, setSearchData] = useState("");
    const [pageno, setPageno] = useState(1);

    
    const limitPerPage = 2;
    let lastItemIndex = limitPerPage * pageno;
    let firstItemIndex = lastItemIndex - limitPerPage;


    const filfData = Data.filter((data)=>
        data.name.toLowerCase().includes(searchData.toLowerCase())
    )

    // search data && Pagination logic
    const filteredData = Data.filter((data)=>
        data.name.toLowerCase().includes(searchData.toLowerCase())
    ).slice(firstItemIndex,lastItemIndex);

    const handleonChange =(e)=>{
        setFormData({...formdata, [e.target.name]: e.target.value});
        // console.log(formdata);
    }

    // for adding new value
    const handleOnClickAdd = ()=>{
        if(formdata.name && formdata.gender && formdata.age){
            
            const newData ={
                id:  Data === "" ? 1 : Data.length+1,
                name: formdata.name,
                gender: formdata.gender,
                age: formdata.age,
            }
            setData([...Data, newData]);
            setFormData({name:"", gender:"", age:""});
            // console.log(Data);
        }
    }

    // for deleteing
    const handledelete =(id)=>{
        filteredData.length ===1 && pageno !== 1 ? setPageno((prev)=> prev-1) : setPageno((prev)=>prev);
        const updateData = Data.filter((data)=> data.id != id );
        setData(updateData);
    }

    // for edit
    const handleEdit =(id)=>{
        setEditId(id);
    }

    // for update
    const handleUpdate =(id)=>{
        const updateData = Data.map((data)=>{
            if(data.id === id){
                const editableRow = document.querySelectorAll(`[class='${id}']`);
                return{
                    ...data,
                    name: editableRow[0].innerText,
                    gender: editableRow[1].innerText,
                    age: editableRow[2].innerText,
                }
            }
            return data;
        })
        setData(updateData);
        setEditId(false);
    }

    // for search
    const handleSearch =(e)=>{
        setSearchData(e.target.value);
    }

    // for pagination call
    const handlePagination =(selectedPage)=>{
        setPageno(selectedPage);
    }

    useEffect(()=>{
        if(!editId) return;
        
        const selectEditId = document.querySelectorAll(`[class='${editId}']`);
        if(selectEditId){
        selectEditId[0].focus();
        }

    },[editId])

    useEffect(()=>{
        localStorage.setItem("CRUD",JSON.stringify(Data));
    },[Data]);


    return(
        <div className="container">
            <div className="add-container">
                <div className="info_container">
                    <input type="text" placeholder="Name" name="name" value={formdata.name} onChange={handleonChange} />
                    <input type="text" placeholder="Gender" name="gender" value={formdata.gender} onChange={handleonChange} />
                    <input type="text" placeholder="Age" name="age" value={formdata.age} onChange={handleonChange} />
                </div>
                <button className="Add" onClick={handleOnClickAdd}>ADD</button>
            </div>

            <div className="search_table_container">
                <input type="text" placeholder="Search by name" className="search-inputbox" name="search" value={searchData} onChange={handleSearch} />

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>age</th>
                            <th>action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((item)=>{
                            return(
                                <tr key={item.id} data-id={item.id}>
                                    <td data-field="name" className={item.id} contentEditable ={editId==item.id} >{item.name}</td>
                                    <td data-field="gender" className={item.id} contentEditable ={editId==item.id} >{item.gender}</td>
                                    <td data-field="age" className={item.id} contentEditable ={editId==item.id} >{item.age}</td>
                                    <td className="action">
                                        {editId != item.id ? <button className="edit" onClick={()=>handleEdit(item.id)}>Edit</button> :
                                         <button className={`update ${item.id}`} onClick={()=>handleUpdate(item.id)}>UpDate</button> }
                                        <button className="delete" onClick={()=>handledelete(item.id)} >Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div className="pagination">
                 {Array.from({length: Math.ceil(filfData.length / limitPerPage)},(_,index)=>(
                    <button key={index+1} style={{backgroundColor: pageno == index+1 && "lightgreen"}} onClick={()=>handlePagination(index+1)} >{index + 1}</button>
                  ))} 
                </div>
            </div>
            
        </div>
    );
}
export default DataTable;