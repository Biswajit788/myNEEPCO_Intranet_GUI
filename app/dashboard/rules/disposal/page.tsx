"use client";
import { useState, useEffect } from 'react';
import RulesPage from '@/components/RulesPage';
import { fetchDisposalRules } from '@/services/api';

export default function DisposalRulesPage() {
    const [disposalRules, setDisposalRules] = useState([]);
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
                    file1Url: item.attributes.File1?.data?.attributes?.url || null,
                }));
                setDisposalRules(rules);
            } catch (err: any) {
                console.error('Error fetching DoP rules:', err.message || err);
                setError('Error fetching DoP rules');
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