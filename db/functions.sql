-- Create a session and an initial action item atomically

CREATE OR REPLACE FUNCTION public.create_session_with_initial_action(
  p_client_id uuid,
  p_provider_id uuid,
  p_provider_type text,
  p_program_id bigint,
  p_scheduled_at timestamptz,
  p_title text,
  p_action_title text,
  p_action_description text,
  p_action_due_date date
)
RETURNS bigint
LANGUAGE plpgsql
AS $$
DECLARE
  v_session_id bigint;
BEGIN
  -- Insert the session
  INSERT INTO public.sessions (
    client_id,
    provider_id,
    provider_type,
    scheduled_at,
    status,
    program_id
  )
  VALUES (
    p_client_id,
    p_provider_id,
    p_provider_type,
    p_scheduled_at,
    'scheduled',
    p_program_id
  )
  RETURNING id INTO v_session_id;

  -- Insert an initial action item for this session
  INSERT INTO public.action_items (
    client_id,
    session_id,
    goal_id,
    created_by,
    title,
    description,
    due_date,
    status
  )
  VALUES (
    p_client_id,
    v_session_id,
    NULL,
    p_provider_id,
    p_action_title,
    p_action_description,
    p_action_due_date,
    'open'
  );

  RETURN v_session_id;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, the entire transaction is rolled back automatically.
    RAISE;
END;
$$;
