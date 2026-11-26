-- Learners may list quiz metadata for courses they can access. Question rows
-- and answer keys remain protected behind the get_quiz RPC.
create policy "learners list quizzes for enrolled courses"
on public.quizzes for select to authenticated
using (
  exists (
    select 1 from public.course_modules m
    where m.id = quizzes.module_id
      and (select public.has_active_enrollment(m.course_id))
  )
);
