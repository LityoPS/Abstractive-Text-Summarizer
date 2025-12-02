import { Container } from "./Container";

export const HowToUse = () => {
    const steps = [
        {
            number: "1",
            title: "Input Text",
            description: "Paste or type the text you want to summarize into the input field. Any length of content works, from short paragraphs to lengthy documents."
        },
        {
            number: "2",
            title: "Adjust Style",
            description: "Select your preferred summary style from the three options: Harsh for brevity, Standard for a middle ground, or Detailed for comprehensive coverage."
        },
        {
            number: "3",
            title: "Get Summary",
            description: "Click the \"Generate Summary\" button to create your summary instantly. Review the result and copy it for use wherever you need it."
        }
    ];

    return (
        <Container className="pb-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative flex flex-col items-center text-center">
                            <div className="mb-6">
                                <div className="w-16 h-16 rounded-xl bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">
                                        {step.number}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {step.title}
                            </h3>

                            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-6.5 transform -translate-y-1/2">
                                    <span className="text-3xl font-semibold text-gray-300 dark:text-gray-600">
                                        &gt;
                                    </span>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};