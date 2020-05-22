(comment
  ;; TODO: This is a single line comment
  ;; FIXME: This is a single line fixme

  (defn -main []
    "I can say 'Hello World'."
    (println "Hello, World!"))
)

(defn hello-world [] (println "Hello, World!"))
(defn -main []
  "I can call a function, which prints 'Hello World'."
  (hello-world))
