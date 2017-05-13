CREATE OR REPLACE FUNCTION "USER"."F_TEST"
/*
  Test function
  @TODO: Sql multi comment
*/
( aParam VARCHAR2 )
RETURN VARCHAR2 AS
BEGIN

  -- TODO Sql single comment
  RETURN '1';

END F_TEST;
/