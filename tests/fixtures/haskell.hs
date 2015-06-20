insertWithKey' :: Ord k => (k -> a -> a -> a) -> k -> a -> Map k a -> Map k a
-- We do not reuse Data.Map.Strict.insertWithKey, because it is stricter it
-- forces evaluation of the given value.
-- FIXME: force evaluation of the given value
insertWithKey' = Strict.insertWithKey
#if __GLASGOW_HASKELL__ >= 700
{-# INLINABLE insertWithKey' #-}
#else
{-# INLINE insertWithKey' #-}
-- TODO: this will be deprecated soon
#endif
