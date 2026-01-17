from app.core.security import get_password_hash, verify_password

print("Testing '123456'...")
try:
    hash1 = get_password_hash("123456")
    print(f"Success: {hash1[:20]}...")
except Exception as e:
    print(f"Error hashing '123456': {e}")

print("\nTesting 80 chars...")
long_pw = "a" * 80
try:
    hash2 = get_password_hash(long_pw)
    print(f"Success with 80 chars: {hash2[:20]}...")
except Exception as e:
    print(f"Error hashing 80 chars: {e}")

print("\nTesting truncation logic...")
if len(long_pw.encode('utf-8')) > 72:
    truncated = long_pw[:72]
    print(f"Truncated 80 chars to: {len(truncated)}")
    try:
        hash3 = get_password_hash(truncated)
        print(f"Success hashing truncated: {hash3[:20]}...")
    except Exception as e:
        print(f"Error hashing truncated: {e}")

print("\nTesting verify...")
try:
    res = verify_password("123456", hash1)
    print(f"Verify '123456': {res}")
except Exception as e:
    print(f"Error verify: {e}")
