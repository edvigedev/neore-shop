import { useState, useEffect } from "react";
import Card from "./Card";
import "./CardsContainer.css";

export default function CardsContainer(){

const [data, setData] = useState<any>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);


useEffect(() => {
    const fetchData = async () => {
        try{ const response = await fetch('https://dummyjson.com/products')
            if (!response.ok){
                throw new Error('Failed to fetch data')
            }
            const result = await response.json();
            setData(result)
            

        } catch(error){
            setError(error as any);
        }
        finally{
            setLoading(false);
        }

    };
    fetchData();
}, []);

if(loading){
    return <div>Loading...</div>
}

if(error){
    return <div>Error: {error}</div>
}



    return(
        <section className="cards-container">
            <ul className="cards-container-list">
                {data.products.map((product:any)=> 
                <li key={product.id}>
                    <Card product={product}/>
                </li>)
                }
            </ul>
    </section>
    )
}