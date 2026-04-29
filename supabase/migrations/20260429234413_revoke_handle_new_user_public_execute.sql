/*
  # Revoke PUBLIC EXECUTE on handle_new_user()

  The handle_new_user() function is a trigger function and should only be invoked
  by the trigger system (postgres role), not callable directly via the REST API.

  Revoking EXECUTE from PUBLIC removes access for both anon and authenticated roles,
  since PUBLIC is a catch-all that includes all roles.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
