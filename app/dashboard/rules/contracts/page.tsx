"use client";
import { useState, useEffect } from 'react';
import RulesPage from '@/components/RulesPage';
import { fetchCpRules } from '@/services/api';

export default function ContractRulesPage() {
    const [cpRules, setCpRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                setLoading(true);
                const data = await fetchCpRules();
                const rules = data.data.map((item: any) => ({
                    id: item.id,
                    title: item.attributes.Title || 'No Title',
                    dated: item.attributes.Dated || 'Unknown Date',
                    fileUrl: item.attributes.File?.data?.attributes?.url || null,
                    file1Urls: Array.isArray(item.attributes.File1?.data)
                        ? item.attributes.File1.data.map((file: any) => file.attributes.url)
                        : [],
                }));
                setCpRules(rules);
            } catch (err: any) {
                console.error('Error fetching rules:', err.message || err);
                setError('Error fetching Contract & Procurement rules document');
            } finally {
                setLoading(false);
            }
        };
        fetchRules();
    }, []);    

    return (
        <RulesPage
            rules={cpRules}
            title="In force"
            heading="Contracts & Procurement Manual"
            isLoading={loading}
            error={error}
        />
    );
}
