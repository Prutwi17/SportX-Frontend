export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About SportX</h1>
      <p className="text-lg text-gray-700 mb-6">
        SportX is your premier destination for high-quality sports equipment. We are passionate
        about sports and committed to providing athletes of all levels with the gear they need
        to perform at their best.
      </p>
      <p className="text-lg text-gray-700 mb-6">
        Founded with a vision to make premium sports equipment accessible to everyone,
        SportX offers a wide range of products from top brands across cricket, football,
        basketball, and more.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">Empower every athlete with the best equipment</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">👁️</div>
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600">Be the most trusted sports equipment platform</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">💪</div>
          <h3 className="text-xl font-semibold mb-2">Our Values</h3>
          <p className="text-gray-600">Quality, authenticity, and customer satisfaction</p>
        </div>
      </div>
    </div>
  );
}
