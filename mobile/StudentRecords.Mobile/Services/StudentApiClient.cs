using System.Net.Http.Json;
using StudentRecords.Mobile.Models;

namespace StudentRecords.Mobile.Services;

public sealed class StudentApiClient(HttpClient httpClient)
{
    public async Task<List<Student>> GetStudentsAsync() =>
        await httpClient.GetFromJsonAsync<List<Student>>("api/students") ?? [];
}
