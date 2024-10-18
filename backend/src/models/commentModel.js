const { createClient } = require('@supabase/supabase-js');

// Supabase inicijalizacija
const supabaseUrl = 'https://twblcijjauuhecvnsohs.supabase.co';
const supabaseKey = 'your_supabase_key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Kreiranje komentara
async function createComment(postId, userId, content) 
{
    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_id: userId, content }]);
    return { data, error };
}

// Dobijanje komentara za post
async function getCommentsForPost(postId) 
{
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId);
    return { data, error };
}

// Ažuriranje komentara
async function updateComment(commentId, content) 
{
    const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);
    return { data, error };
}

// Brisanje komentara
async function deleteComment(commentId) 
{
    const { data, error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
    return { data, error };
}

module.exports = 
{
    createComment,
    getCommentsForPost,
    updateComment,
    deleteComment
};
