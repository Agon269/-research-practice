import {Product} from '../product';

it('implements OCC', async (done)=>{
      // Create an instance of a product
  const product = Product.build({
    title: 'uggs',
    price: 65,
    userId: '123',
  });

  // Save the product to the database
  await product.save();

  // fetch the product twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);

  // make two separate changes to the products we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched product
  await firstInstance!.save();

  // save the second fetched product and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});


it('increments the version number on multiple saves', async () => {
  const product = Product.build({
    title: 'uggs',
    price: 99,
    userId: '123',
  });

  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);
  await product.save();
  expect(product.version).toEqual(2);
});