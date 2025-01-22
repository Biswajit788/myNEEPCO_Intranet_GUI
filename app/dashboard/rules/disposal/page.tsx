"use client";
import { useState, useEffect } from 'react';
import RulesPage from '@/components/RulesPage';
import { fetchDisposalRules } from '@/services/api';

export default function ContractRulesPage() {
    const [disposalRules,setDisposalRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                setLoading(true);
                const data = await fetchDisposalRules();
                const rules = data.data.map((item: any) => ({
                    id: item.id,
                    title: item.attributes.Title || 'No Title',
                    dated: item.attributes.Dated || 'Unknown Date',
                    fileUrl: item.attributes.File?.data?.attributes?.url || null,
                    file1Urls: Array.isArray(item.attributes.File1?.data)
                        ? item.attributes.File1.data.map((file: any) => file.attributes.url)
                        : [],
                }));
                setDisposalRules(rules);
            } catch (err: any) {
                console.error('Error fetching rules:', err.message || err);
                setError('Error fetching Disposal Manual document');
            } finally {
                setLoading(false);
            }
        };
        fetchRules();
    }, []);    

    return (
        <RulesPage
            rules={disposalRules}
            title="In force"
            heading="Disposal Manual"
            isLoading={loading}
            error={error}
        />
    );
}
