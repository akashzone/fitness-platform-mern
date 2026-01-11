const pkg = require('cashfree-pg');
console.log('Keys:', Object.keys(pkg));
try {
    console.log('CFEnvironment:', pkg.CFEnvironment);
} catch (e) {
    console.log('CFEnvironment Error:', e.message);
}
