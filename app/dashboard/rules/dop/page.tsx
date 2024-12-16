"use client";
import { useState, useEffect } from 'react';
import RulesPage from '@/components/RulesPage';
import { fetchDopRules } from '@/services/api';

export default function DopRulesPage() {
    const [dopRules, setDopRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                setLoading(true);
                const data = await fetchDopRules();
                const rules = data.data.map((item: any) => ({
                    id: item.id,
                    title: item.attributes.Title || 'No Title',
                    dated: item.attributes.Dated || 'Unknown Date',
                    fileUrl: item.attributes.File?.data?.attributes?.url || null,
                    file1Urls: Array.isArray(item.attributes.File1?.data)
                    ? item.attributes.File1.data.map((file: any) => file.attributes.url)
                    : [],
                }));
                setDopRules(rules);
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
            rules={dopRules}
            title="In force"
            heading="Delegation of Power (DoP)"
            isLoading={loading}
            error={error}
        />
    );
}
