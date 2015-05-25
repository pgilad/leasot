#include <stdio.h>

main()
{
   FILE *fp;
   // TODO: decide whether to use a pointer
   char buff[255];

   fp = fopen("/tmp/test.txt", "r");
   fscanf(fp, "%s", buff);
   printf("1 : %s\n", buff );

   fgets(buff, 255, (FILE*)fp);
   printf("2: %s\n", buff );

   fgets(buff, 255, (FILE*)fp);
   printf("3: %s\n", buff );
   /* FIXME: make sure file can be closed */
   fclose(fp);
}
