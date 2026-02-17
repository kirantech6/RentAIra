import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    setDoc,
    query,
    orderBy
} from 'firebase/firestore';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [properties, setProperties] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [applications, setApplications] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [messages, setMessages] = useState([]);
    const [incomeApplications, setIncomeApplications] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [scheduledTasks, setScheduledTasks] = useState([]);
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time Firestore Listeners
        const collections = [
            { name: 'properties', setter: setProperties },
            { name: 'maintenanceRequests', setter: setMaintenanceRequests },
            { name: 'applications', setter: setApplications, order: 'date' },
            { name: 'reviews', setter: setReviews },
            { name: 'messages', setter: setMessages, order: 'timestamp' },
            { name: 'incomeApplications', setter: setIncomeApplications },
            { name: 'expenses', setter: setExpenses },
            { name: 'scheduledTasks', setter: setScheduledTasks },
            { name: 'leases', setter: setLeases }
        ];

        const unsubscribes = collections.map(col => {
            const colRef = collection(db, col.name);
            const q = col.order ? query(colRef, orderBy(col.order, 'desc')) : colRef;

            return onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                col.setter(data);

                // Once at least one snapshot is received, we can start considering it loaded
                // though a more robust way would be to wait for all initial snapshots.
                setLoading(false);
            }, (error) => {
                console.error(`Error fetching ${col.name}:`, error);
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    const addProperty = async (property) => {
        try {
            await addDoc(collection(db, 'properties'), {
                ...property,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding property:", error);
        }
    };

    const updateProperty = async (id, updates) => {
        try {
            const propRef = doc(db, 'properties', id);
            await updateDoc(propRef, updates);
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    const addMaintenanceRequest = async (request) => {
        try {
            await addDoc(collection(db, 'maintenanceRequests'), {
                ...request,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error adding maintenance request:", error);
        }
    };

    const updateMaintenanceRequest = async (id, updates) => {
        try {
            const reqRef = doc(db, 'maintenanceRequests', id);
            await updateDoc(reqRef, updates);
        } catch (error) {
            console.error("Error updating maintenance request:", error);
        }
    };

    const addApplication = async (application) => {
        try {
            await addDoc(collection(db, 'applications'), {
                ...application,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error adding application:", error);
        }
    };

    const addReview = async (review) => {
        try {
            await addDoc(collection(db, 'reviews'), {
                ...review,
                date: new Date().toISOString().split('T')[0],
                verified: true
            });
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const addMessage = async (message) => {
        try {
            await addDoc(collection(db, 'messages'), {
                ...message,
                timestamp: new Date().toISOString(),
                read: false
            });
        } catch (error) {
            console.error("Error adding message:", error);
        }
    };

    const submitIncomeApplication = async (app) => {
        try {
            await addDoc(collection(db, 'incomeApplications'), {
                ...app,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error submitting income application:", error);
        }
    };

    const addExpense = async (expense) => {
        try {
            await addDoc(collection(db, 'expenses'), {
                ...expense,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };

    const addScheduledTask = async (task) => {
        try {
            await addDoc(collection(db, 'scheduledTasks'), {
                ...task,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding scheduled task:", error);
        }
    };

    const addLease = async (lease) => {
        try {
            await addDoc(collection(db, 'leases'), {
                ...lease,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding lease:", error);
        }
    };

    const savedProperties = (userId) => {
        // This could be a sub-collection in users or separate collection
        return [];
    };

    return (
        <DataContext.Provider value={{
            properties,
            maintenanceRequests,
            applications,
            reviews,
            messages,
            incomeApplications,
            expenses,
            scheduledTasks,
            leases,
            loading,
            addProperty,
            updateProperty,
            addMaintenanceRequest,
            updateMaintenanceRequest,
            addApplication,
            addReview,
            addMessage,
            submitIncomeApplication,
            addExpense,
            addScheduledTask,
            addLease
        }}>
            {children}
        </DataContext.Provider>
    );
};
