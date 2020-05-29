import React from 'react'
import axios from 'axios'

export const Landing = (userId) => {
    // Example of fetching data from an API with React, this code will be removed in future development
    const [ users, setUsers ] = React.useState(null)
    const [ loading, setLoading ] = React.useState(false)

    React.useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)

            const users = await axios.get('http://localhost:5000/api/profile')
            setUsers(users)
            setLoading(false)
        }

        fetchUsers()
    }, [])

    return (
        !loading ? <section className="landing">
            <h1 style={{color: 'white', width: '200px', margin : '0 auto'}}>WorkoutTracker</h1>

            <pre>
                <code>
                    {JSON.stringify(users)}
                </code>
            </pre>
        </section> : 'loading...'
    )
}

export default Landing;