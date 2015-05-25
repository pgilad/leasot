data := make([]byte, 100)
count, err := file.Read(data)
//TODO: be more explicit here
if err != nil {
	log.Fatal(err)
}
fmt.Printf("read %d bytes: %q\n", count, data[:count])
