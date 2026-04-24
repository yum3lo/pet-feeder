import {
  createPet,
  updatePet,
  deletePet,
  toggleCatSchedule,
  uploadPetImage,
  getMockAllSchedules,
  useGetPets,
  useGetCatSchedules,
  useGetFeedingHistory,
  useCreateCat,
  useUpdateCat,
  useUploadPetImage,
  useDeleteCat,
} from '@/services/pets';

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();
const mockPatch = jest.fn();

jest.mock('@/services/api', () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    put: (...args: unknown[]) => mockPut(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
    patch: (...args: unknown[]) => mockPatch(...args),
  },
}));

const mockUseQuery = jest.fn();
const mockUseMutation = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createPet', () => {
  it('posts to /cats with the payload and returns the pet', async () => {
    const pet = { id: 1, name: 'Luna' };
    mockPost.mockResolvedValue({ data: pet });

    const result = await createPet({ name: 'Luna' });

    expect(mockPost).toHaveBeenCalledWith('/cats', { name: 'Luna' });
    expect(result).toEqual(pet);
  });
});

describe('updatePet', () => {
  it('puts to /cats/:id with the remaining payload and returns the pet', async () => {
    const pet = { id: 3, name: 'Max', breed: 'Bengal' };
    mockPut.mockResolvedValue({ data: pet });

    const result = await updatePet({ id: 3, name: 'Max', breed: 'Bengal' });

    expect(mockPut).toHaveBeenCalledWith('/cats/3', { name: 'Max', breed: 'Bengal' });
    expect(result).toEqual(pet);
  });

  it('does not include id in the body', async () => {
    mockPut.mockResolvedValue({ data: { id: 5, name: 'Alice' } });
    await updatePet({ id: 5, name: 'Alice' });

    const body = mockPut.mock.calls[0][1];
    expect(body).not.toHaveProperty('id');
  });
});

describe('deletePet', () => {
  it('sends DELETE to /cats/:id', async () => {
    mockDelete.mockResolvedValue({});
    await deletePet(7);
    expect(mockDelete).toHaveBeenCalledWith('/cats/7');
  });
});

describe('toggleCatSchedule', () => {
  it('patches /pet-feeder/cats/:catId/toggle with isActive: true', async () => {
    mockPatch.mockResolvedValue({});
    await toggleCatSchedule(2, true);
    expect(mockPatch).toHaveBeenCalledWith('/pet-feeder/cats/2/toggle', { isActive: true });
  });

  it('patches /pet-feeder/cats/:catId/toggle with isActive: false', async () => {
    mockPatch.mockResolvedValue({});
    await toggleCatSchedule(2, false);
    expect(mockPatch).toHaveBeenCalledWith('/pet-feeder/cats/2/toggle', { isActive: false });
  });
});

describe('uploadPetImage', () => {
  it('posts to /cats/:id/image with multipart/form-data header', async () => {
    mockPost.mockResolvedValue({});
    // stub FormData so expo's implementation is not invoked
    const appendMock = jest.fn();
    (global as any).FormData = jest.fn(() => ({ append: appendMock }));

    await uploadPetImage({ id: 4, uri: 'file://photo.jpg' });

    const [url, , config] = mockPost.mock.calls[0];
    expect(url).toBe('/cats/4/image');
    expect(config.headers['Content-Type']).toBe('multipart/form-data');
  });
});

describe('getMockAllSchedules', () => {
  it('returns the hardcoded mock schedule entries', async () => {
    const result = await getMockAllSchedules();
    expect(result).toEqual([
      { petName: 'Pookie', time: '21:57' },
      { petName: 'Pookie', time: '17:00' },
    ]);
  });
});

describe('getPets (via useGetPets)', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({ data: [], isLoading: false });
  });

  it('calls useQuery with the cats query key', () => {
    useGetPets();
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['cats'] }),
    );
  });

  it('queryFn calls GET /cats and returns data', async () => {
    const pets = [{ id: 1, name: 'Luna' }];
    mockGet.mockResolvedValue({ data: pets });
    useGetPets();
    const { queryFn } = mockUseQuery.mock.calls[0][0];
    const result = await queryFn();
    expect(mockGet).toHaveBeenCalledWith('/cats');
    expect(result).toEqual(pets);
  });
});

describe('getCatSchedules (via useGetCatSchedules)', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({ data: [], isLoading: false });
  });

  it('calls useQuery with the schedules query key and catId', () => {
    useGetCatSchedules(7);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['schedules', 7], enabled: true }),
    );
  });

  it('is disabled when catId is undefined', () => {
    useGetCatSchedules(undefined);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('queryFn calls GET /pet-feeder/cats/:catId/schedules and returns data', async () => {
    const schedules = [{ id: 1, time: '08:00', amount: 50, isActive: true }];
    mockGet.mockResolvedValue({ data: schedules });
    useGetCatSchedules(7);
    const { queryFn } = mockUseQuery.mock.calls[0][0];
    const result = await queryFn();
    expect(mockGet).toHaveBeenCalledWith('/pet-feeder/cats/7/schedules');
    expect(result).toEqual(schedules);
  });
});

describe('getFeedingHistory (via useGetFeedingHistory)', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({ data: [], isLoading: false });
  });

  it('calls useQuery with the feeding-history query key and catId', () => {
    useGetFeedingHistory(3);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['feeding-history', 3], enabled: true }),
    );
  });

  it('is disabled when catId is undefined', () => {
    useGetFeedingHistory(undefined);
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('queryFn calls GET /pet-feeder/cats/:catId/feeding-history and returns data', async () => {
    const history = [{ id: '1', date: '2026-03-27', feedings: [] }];
    mockGet.mockResolvedValue({ data: history });
    useGetFeedingHistory(3);
    const { queryFn } = mockUseQuery.mock.calls[0][0];
    const result = await queryFn();
    expect(mockGet).toHaveBeenCalledWith('/pet-feeder/cats/3/feeding-history');
    expect(result).toEqual(history);
  });
});

describe('mutation hooks', () => {
  beforeEach(() => {
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it('useCreateCat registers createPet as the mutationFn', () => {
    useCreateCat();
    expect(mockUseMutation).toHaveBeenCalledWith(
      expect.objectContaining({ mutationFn: createPet }),
    );
  });

  it('useUpdateCat registers updatePet as the mutationFn', () => {
    useUpdateCat();
    expect(mockUseMutation).toHaveBeenCalledWith(
      expect.objectContaining({ mutationFn: updatePet }),
    );
  });

  it('useUploadPetImage registers uploadPetImage as the mutationFn', () => {
    useUploadPetImage();
    expect(mockUseMutation).toHaveBeenCalledWith(
      expect.objectContaining({ mutationFn: uploadPetImage }),
    );
  });

  it('useDeleteCat registers deletePet as the mutationFn', () => {
    useDeleteCat();
    expect(mockUseMutation).toHaveBeenCalledWith(
      expect.objectContaining({ mutationFn: deletePet }),
    );
  });
});
