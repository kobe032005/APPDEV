using Microsoft.Extensions.Logging;
using StudentRecords.Mobile.Services;

namespace StudentRecords.Mobile;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
			});

		builder.Services.AddMauiBlazorWebView();
		var apiAddress = DeviceInfo.Platform == DevicePlatform.Android ? "http://10.0.2.2:5000/" : "http://localhost:5000/";
		builder.Services.AddSingleton(new HttpClient { BaseAddress = new Uri(apiAddress) });
		builder.Services.AddSingleton<StudentApiClient>();

#if DEBUG
		builder.Services.AddBlazorWebViewDeveloperTools();
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
