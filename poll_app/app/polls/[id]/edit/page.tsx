'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import EditPollForm from '../../../../components/EditPollForm';
import { Poll } from '../../../../lib/index';

export default function EditPollPage({ params }: { params: { id: string } }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the poll ID from the URL params
        const { id } = params;
        
        // Fetch the poll data from Supabase
        const { data, error } = await supabase
          .from('polls')
          .select('*, options(*)')
          .eq('id', id)
          .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Poll not found');

        // Transform the data to match our Poll type
        const pollData: Poll = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          options: data.options.map((option: any) => ({
            id: option.id,
            text: option.text,
            votes: option.votes
          })),
          created_at: data.created_at,
          user_id: data.user_id
        };

        setPoll(pollData);
      } catch (err) {
        console.error('Error fetching poll:', err);
        setError(err instanceof Error ? err.message : 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params, supabase]);

  const handleSubmit = async (updatedPoll: Poll) => {
    try {
      // Update the poll in Supabase
      const { error: pollError } = await supabase
        .from('polls')
        .update({
          title: updatedPoll.title,
          description: updatedPoll.description
        })
        .eq('id', updatedPoll.id);

      if (pollError) throw new Error(pollError.message);

      // Get current options from database to identify deleted options
      const { data: currentOptions, error: fetchError } = await supabase
        .from('options')
        .select('id')
        .eq('poll_id', updatedPoll.id);

      if (fetchError) throw new Error(fetchError.message);

      // Find options that were deleted (exist in DB but not in updatedPoll)
      const currentOptionIds = currentOptions.map((opt: any) => opt.id);
      const updatedOptionIds = updatedPoll.options
        .filter(opt => !opt.id.startsWith('new-'))
        .map(opt => opt.id);
      
      const deletedOptionIds = currentOptionIds.filter(
        (id: string) => !updatedOptionIds.includes(id)
      );

      // Delete removed options
      if (deletedOptionIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('options')
          .delete()
          .in('id', deletedOptionIds);

        if (deleteError) throw new Error(deleteError.message);
      }

      // Update each option
      for (const option of updatedPoll.options) {
        // Check if this is a new option (id starts with 'new-')
        if (option.id.startsWith('new-')) {
          // Insert new option
          const { error: optionError } = await supabase
            .from('options')
            .insert({
              poll_id: updatedPoll.id,
              text: option.text,
              votes: 0
            });

          if (optionError) throw new Error(optionError.message);
        } else {
          // Update existing option
          const { error: optionError } = await supabase
            .from('options')
            .update({ text: option.text })
            .eq('id', option.id);

          if (optionError) throw new Error(optionError.message);
        }
      }

      // Redirect back to the poll page
      router.push(`/polls/${updatedPoll.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error updating poll:', err);
      setError(err instanceof Error ? err.message : 'Failed to update poll');
    }
  };

  const handleCancel = () => {
    // Navigate back to the poll page
    router.push(`/polls/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => router.push('/polls')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Polls
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found: </strong>
          <span className="block sm:inline">The requested poll could not be found.</span>
        </div>
        <button 
          onClick={() => router.push('/polls')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Polls
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Poll</h1>
      <EditPollForm 
        poll={poll} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
}